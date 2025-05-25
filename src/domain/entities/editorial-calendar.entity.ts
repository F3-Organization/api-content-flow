import { DomainError } from "@/domain/error/index";

export type month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface EditorialCalendarProps {
  id: string;
  userId: string;
  month: month;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export class EditorialCalendar {
  private props: EditorialCalendarProps;
  constructor(props: EditorialCalendarProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get month() {
    return this.props.month;
  }
  set month(value: number) {
    if (value < 1 || value > 12) throw new DomainError("Month must be 1-12");
    this.props.month = value as month;
    this.touch();
  }
  get year() {
    return this.props.year;
  }
  set year(value: number) {
    if (value < 2000) throw new DomainError("Year is required");
    this.props.year = value;
    this.touch();
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateProps(props: EditorialCalendarProps) {
    if (!props.userId) throw new DomainError("UserId is required");
    if (props.month < 1 || props.month > 12)
      throw new DomainError("Month must be 1-12");
    if (props.year < 2000) throw new DomainError("Year is required");
  }
}
