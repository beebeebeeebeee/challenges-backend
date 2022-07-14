import { WalletModel } from 'src/typeorm/entity/wallet.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("user_db")
export class UserModel {

    @PrimaryGeneratedColumn("increment")
    id?: number

    @Column({ type: "varchar" })
    account: string

    @Column({ type: "varchar" })
    password: string

    @Column({ type: "varchar", nullable: true })
    totp?: string

    @OneToMany(type => WalletModel, wallet => wallet.user)
    wallets?: WalletModel[];

}