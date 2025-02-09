import { Observable } from 'rxjs';

export type Sender = string;

export type Reciever = Sender | 'all';

export enum MessageType {
	Status = 'status',
	Content = 'content',
}

export enum StatusType {
	Idle = 'idle',
	Typing = 'typing',
}

export type Message = {
	id: string;
	type: MessageType;
	content: string | StatusType;
	sender: Sender;
	reciever: Reciever;
};

export type ChatMessage = Pick<Message, 'id' | 'sender' | 'reciever'> & {
	type: MessageType.Content;
	content: string;
};

export type StatusMessage = Pick<Message, 'id' | 'sender' | 'reciever'> & {
	type: MessageType.Status;
	content: StatusType;
};

export type Chat = {
	reciever: Reciever;
	messages$: Observable<ChatMessage[]>;
	status$: Observable<StatusType>;
};
