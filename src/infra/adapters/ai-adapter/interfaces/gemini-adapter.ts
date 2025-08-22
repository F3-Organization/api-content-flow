export interface IAiGenerationAdapter {
  generate(prompt: string): Promise<string>;
}
