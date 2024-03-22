type MessageType = {
  userId: string;
  senderRole: string;
  message: string;
  timestamp: string;
  displayName: string;
  avatarDisp: boolean;
  photoURL: string;
};

interface Mediator {
  sendMessage: (forum: string, message: MessageType) => void;
  subscribe: (forum: string, callback: (message: MessageType) => void) => void;
  unsubscribe: (
    forum: string,
    callback: (message: MessageType) => void
  ) => void;
}

export class ChatMediator implements Mediator {
  private subscribers: { [key: string]: ((message: MessageType) => void)[] } =
    {};

  async sendMessage(forum: string, message: MessageType) {
    const send = await fetch("/api/forum", {
      method: "POST",
      body: JSON.stringify(message),
    });

    if (!send.ok) {
      throw new Error("Failed to send message");
    }
    console.log("response", send);

    if (this.subscribers[forum]) {
      this.subscribers[forum].forEach((callback) => {
        callback(message);
      });
    }
  }

  subscribe(forum: string, callback: (message: MessageType) => void): void {
    if (!this.subscribers[forum]) {
      this.subscribers[forum] = [];
    }
    this.subscribers[forum].push(callback);
  }

  unsubscribe(forum: string, callback: (message: MessageType) => void): void {
    if (this.subscribers[forum]) {
      this.subscribers[forum] = this.subscribers[forum].filter(
        (cb) => cb !== callback
      );
    }
  }
}
