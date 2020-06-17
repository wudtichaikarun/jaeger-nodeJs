// @flow
export interface IDemo extends IDemoRequest {
  _id?: string;
}

export interface IDemoRequest {
  name: string;
  author?: string;
  authorEmail: string;
  presentDate: Date;
}
