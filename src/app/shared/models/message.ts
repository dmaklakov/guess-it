import { Command } from "./command.enum";

// Class describing a message (to or from server)
export class Message {

    public cmd: Command;
    public parameters: { [key: string]: any };
}