import {
  Content,
  ContentFormat,
} from "../../../domain/entities/content.entity";

describe("Content Entity", () => {
  const validProps = {
    id: "content-1",
    userId: "user-1",
    title: "Título do post",
    body: "Texto gerado pela IA",
    format: "blog" as ContentFormat,
    topic: "Marketing Digital",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create content with valid props", () => {
    const content = new Content(validProps);
    expect(content.id).toBe(validProps.id);
    expect(content.userId).toBe(validProps.userId);
    expect(content.title).toBe(validProps.title);
    expect(content.body).toBe(validProps.body);
    expect(content.format).toBe("blog");
    expect(content.topic).toBe("Marketing Digital");
  });

  it("should throw error if userId is empty", () => {
    expect(() => new Content({ ...validProps, userId: "" })).toThrow(
      "UserId is required"
    );
  });
  it("should throw error if title is empty", () => {
    expect(() => new Content({ ...validProps, title: "" })).toThrow(
      "Title is required"
    );
  });
  it("should throw error if body is empty", () => {
    expect(() => new Content({ ...validProps, body: "" })).toThrow(
      "Body is required"
    );
  });
  it("should throw error if format is empty", () => {
    expect(() => new Content({ ...validProps, format: "" as any })).toThrow(
      "Format is required"
    );
  });

  it("should update title and updatedAt", async () => {
    const content = new Content(validProps);
    const oldUpdatedAt = content.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    content.title = "Novo Título";
    expect(content.title).toBe("Novo Título");
    expect(content.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update body and updatedAt", async () => {
    const content = new Content(validProps);
    const oldUpdatedAt = content.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    content.body = "Novo texto";
    expect(content.body).toBe("Novo texto");
    expect(content.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update format and updatedAt", async () => {
    const content = new Content(validProps);
    const oldUpdatedAt = content.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    content.format = "social";
    expect(content.format).toBe("social");
    expect(content.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update topic and updatedAt", async () => {
    const content = new Content(validProps);
    const oldUpdatedAt = content.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    content.topic = "Vendas";
    expect(content.topic).toBe("Vendas");
    expect(content.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });
});
