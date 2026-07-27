import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const initialState = {
  nextSequence: 1,
  requests: {},
  activeRequestByChatId: {},
};

export class RequestStore {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.filePath = path.join(dataDir, "requests.json");
    this.state = structuredClone(initialState);
  }

  async load() {
    await mkdir(this.dataDir, { recursive: true });
    try {
      const raw = await readFile(this.filePath, "utf8");
      this.state = JSON.parse(raw);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      await this.save();
    }
  }

  async save() {
    await mkdir(this.dataDir, { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(this.state, null, 2)}\n`, "utf8");
  }

  async createRequest({ serviceKey, client }) {
    const id = `REQ-${String(this.state.nextSequence).padStart(5, "0")}`;
    const now = new Date().toISOString();
    this.state.nextSequence += 1;
    this.state.requests[id] = {
      id,
      serviceKey,
      status: "collecting",
      client,
      messages: [],
      attachments: [],
      adminNotes: [],
      createdAt: now,
      updatedAt: now,
    };
    this.state.activeRequestByChatId[String(client.chatId)] = id;
    await this.save();
    return this.state.requests[id];
  }

  getRequest(id) {
    return this.state.requests[id] || null;
  }

  getActiveRequest(chatId) {
    const id = this.state.activeRequestByChatId[String(chatId)];
    return id ? this.getRequest(id) : null;
  }

  async addClientMessage(id, message) {
    const request = this.getRequest(id);
    if (!request) return null;
    request.messages.push({ ...message, createdAt: new Date().toISOString() });
    request.updatedAt = new Date().toISOString();
    await this.save();
    return request;
  }

  async addAttachment(id, attachment) {
    const request = this.getRequest(id);
    if (!request) return null;
    request.attachments.push({ ...attachment, createdAt: new Date().toISOString() });
    request.updatedAt = new Date().toISOString();
    await this.save();
    return request;
  }

  async addAdminNote(id, note) {
    const request = this.getRequest(id);
    if (!request) return null;
    request.adminNotes.push({ ...note, createdAt: new Date().toISOString() });
    request.updatedAt = new Date().toISOString();
    await this.save();
    return request;
  }

  async setStatus(id, status) {
    const request = this.getRequest(id);
    if (!request) return null;
    request.status = status;
    request.updatedAt = new Date().toISOString();
    if (status === "closed") {
      delete this.state.activeRequestByChatId[String(request.client.chatId)];
    }
    await this.save();
    return request;
  }
}
