export interface Network {
  id: string;
  displayName: string;
  protocol: string;
  host: string;
  port: number;
  predefined?: boolean;
  orteliusAddress: string;
}
