// vitest-sequencer-filename.ts
import type { TestSequencer, TestSpecification, Vitest } from 'vitest/node';

// Implemente APENAS a interface TestSequencer
export class FilenameSequencer implements TestSequencer {
    // O construtor é parte da classe, não da interface que ela implementa
    constructor (ctx: Vitest) { }

    shard(files: TestSpecification[]): TestSpecification[] {
      // Adicione a lógica de sharding aqui se necessário
      return files;
    }

    sort(tests: TestSpecification[]): TestSpecification[] {
        // Retorna os testes ordenados pelo nome
        return tests.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
    }
}