export interface PlanProps {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeatures;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeatures {
  users: number;
  metrics: string[];
  integrations: string[];
  contentFormats: string[];
  postsPerMonth: string;
  editorialCalendar: string[];
}

export class Plan {
  private props: PlanProps;
  constructor(props: PlanProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get getId() {
    return this.props.id;
  }

  get getName() {
    return this.props.name;
  }

  get getPrice() {
    return this.props.price;
  }

  get getDescription() {
    return this.props.description;
  }

  get getFeatures() {
    return this.props.features;
  }

  get getCreatedAt() {
    return this.props.createdAt;
  }

  get getUpdatedAt() {
    return this.props.updatedAt;
  }

  private validateProps(props: PlanProps) {
    this.validateName(props.name);
    this.validatePrice(props.price);
    this.validateDescription(props.description);
    this.validateFeatures(props.features);
    this.validateDates(props.createdAt, props.updatedAt);
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("O nome do plano não pode ser vazio.");
    }
  }

  private validatePrice(price: number) {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new Error("O preço do plano deve ser um número não negativo.");
    }
  }

  private validateDescription(description: string) {
    if (description === null || description === undefined) {
      throw new Error("A descrição não pode ser nula.");
    }
  }

  private validateFeatures(features: PlanFeatures) {
    if (
      typeof features !== "object" ||
      features === null ||
      Array.isArray(features)
    ) {
      throw new Error("Features deve ser um objeto.");
    }
    if (
      !features.users ||
      !features.metrics ||
      !features.integrations ||
      !features.contentFormats ||
      !features.postsPerMonth ||
      !features.editorialCalendar
    ) {
      throw new Error("Todos os campos de features devem estar preenchidos.");
    }
  }

  private validateDates(createdAt: Date, updatedAt: Date) {
    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new Error("Data de criação inválida.");
    }
    if (!(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new Error("Data de atualização inválida.");
    }
  }
}
