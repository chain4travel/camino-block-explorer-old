export interface Network {
  name: string;
  displayName: string;
  protocol: string;
  host: string;
  port: number;
  predefined? : boolean;
}
