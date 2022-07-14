import { WalletType } from 'src/model/wallet/wallet.type';
import { UserModel } from 'src/typeorm/entity/user.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("wallet_db")
export class WalletModel {

    @PrimaryGeneratedColumn("increment")
    id?: number

    @Column({ type: "bigint" })
    user_id: number

    @Column({ type: "varchar" })
    type: WalletType

    @Column({ type: "decimal" })
    balance: number

    @ManyToOne(type => UserModel)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: UserModel;

}