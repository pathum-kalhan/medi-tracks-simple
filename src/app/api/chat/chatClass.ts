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
  sendMessage: (message: MessageType) => void;
  subscribe: (callback: (message: MessageType) => void) => void;
}

export class ChatMediator implements Mediator {
  private subscribers: ((message: MessageType) => void)[] = [];

  async sendMessage(message: MessageType) {
    const send = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(message),
    });

    if (!send.ok) {
      throw new Error("Failed to send message");
    }
    console.log("response", send);

    this.subscribers.forEach((callback) => {
      callback(message);
    });
  }

  subscribe(callback: (message: MessageType) => void): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: (message: MessageType) => void): void {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
}
