export default async function insertMultiple<T>(
  data: T,
  useCase: (item: any) => void,
  quantity: number
): Promise<void> {
  for (let i = 0; i < quantity; i++) {
    await useCase(data);
  }
}
