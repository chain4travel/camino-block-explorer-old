export class Network {
  name: string;
  displayName: string;
  protocol: string;
  host: string;
  port: number;
  predefined: boolean;

  constructor(name: string, displayName: string, protocol: string, host: string, port: number, predefined = false) {
    this.name = name;
    this.displayName = displayName;
    this.protocol = protocol;
    this.host = host;
    this.port = port;
    this.predefined = predefined;
  }
}
