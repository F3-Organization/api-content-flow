import { IAuthRepository, IRepositoryFactory, IUseCase, IUserRepository } from "@/application";
import { recoveryPasswordNamespace } from "./interfaces/recovery-password.interface";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class RecoveryPasswordUseCase implements IUseCase {
    private authRepository: IAuthRepository;
    private userRepository: IUserRepository;
    constructor(private readonly repositoryFactory: IRepositoryFactory) {
        this.userRepository = this.repositoryFactory.createUserRepository()
        this.authRepository = this.repositoryFactory.createAuthRepository()
    }
    async execute(input: recoveryPasswordNamespace.Input): Promise<any> {
        const user = await this.userRepository.getByEmail(input.email)
        if (!user) throw new DomainException("Usuário não encontrado", HttpStatus.NOT_FOUND)
        const
    }

}