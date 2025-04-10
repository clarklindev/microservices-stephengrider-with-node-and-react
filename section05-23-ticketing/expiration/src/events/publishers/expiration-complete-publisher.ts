import { Publisher, Subjects, ExpirationCompleteEvent } from "@fightclub/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete;
}