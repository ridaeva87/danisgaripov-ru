import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const initialState = {
  nextSequence: 1,
  requests: {},
  activeRequestByChatId: {},
  consentByChatId: {},
  processedEvents: {},
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
      this.state = {
        ...structuredClone(initialState),
        ...this.state,
        requests: this.state.requests || {},
        activeRequestByChatId: this.state.activeRequestByChatId || {},
        consentByChatId: this.state.consentByChatId || {},
        processedEvents: this.state.processedEvents || {},
      };
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
    return this.createRequestFromSite({ serviceKey, client });
  }

  async createRequestFromSite({ serviceKey, client, packageName = "", price = "", payment = {}, answers = [], source = "danisgaripov.ru", requestKey = "" }) {
    if (requestKey && this.state.processedEvents?.[requestKey]) {
      return this.getRequest(this.state.processedEvents[requestKey]);
    }

    const id = `REQ-${String(this.state.nextSequence).padStart(5, "0")}`;
    const now = new Date().toISOString();
    this.state.nextSequence += 1;
    this.state.requests[id] = {
      id,
      serviceKey,
      packageName,
      price,
      payment,
      source,
      status: "collecting",
      client,
      answers,
      messages: [],
      attachments: [],
      adminNotes: [],
      assignedTo: null,
      createdAt: now,
      updatedAt: now,
    };
    if (client.chatId) {
      this.state.activeRequestByChatId[String(client.chatId)] = id;
    }
    if (requestKey) {
      this.state.processedEvents[requestKey] = id;
    }
    await this.save();
    return this.state.requests[id];
  }

  async rememberConsent({ chatId, documentVersion = "2026-07-27" }) {
    const now = new Date().toISOString();
    this.state.consentByChatId[String(chatId)] = {
      chatId,
      acceptedAt: now,
      documentVersion,
    };
    await this.save();
    return this.state.consentByChatId[String(chatId)];
  }

  hasConsent(chatId) {
    return Boolean(this.state.consentByChatId?.[String(chatId)]);
  }

  getRequest(id) {
    return this.state.requests[id] || null;
  }

  getActiveRequest(chatId) {
    const id = this.state.activeRequestByChatId[String(chatId)];
    return id ? this.getRequest(id) : null;
  }

  getRequestsByChatId(chatId) {
    return Object.values(this.state.requests)
      .filter((request) => String(request.client?.chatId || "") === String(chatId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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

  async assignRequest(id, assignee) {
    const request = this.getRequest(id);
    if (!request) return null;
    if (request.assignedTo?.id && request.assignedTo.id !== assignee.id) {
      return request;
    }
    request.assignedTo = { ...assignee, assignedAt: new Date().toISOString() };
    request.status = "in_progress";
    request.updatedAt = new Date().toISOString();
    await this.save();
    return request;
  }
}
