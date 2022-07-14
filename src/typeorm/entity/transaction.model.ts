import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("transaction_db")
export class TransactionModel {

    @PrimaryGeneratedColumn("increment")
    id?: number

    @Column({ type: "bigint" })
    user_id: number

    @Column({ type: "varchar" })
    from: string

    @Column({ type: "varchar" })
    to: string

    @Column({ type: "decimal" })
    fromAmount: number

    @Column({ type: "decimal" })
    toAmount: number

    @Column({ type: "decimal" })
    rate: number

    @Column({ type: "varchar" })
    status: string

    @CreateDateColumn({ type: "datetime" })
    timestamp?: Date

}