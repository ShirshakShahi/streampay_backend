// user.model.ts
import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import { Stream } from "./Stream";

@Table({
    tableName: User.USER_TABLE_NAME,
    timestamps: true,
})
export class User extends Model {
    public static USER_TABLE_NAME = "user";
    public static ID = "id";
    public static WALLET_ADDRESS = "wallet_address";

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: User.ID,
    })
    id!: number;

    @Column({
        type: DataType.STRING(100),
        field: User.WALLET_ADDRESS,
        allowNull: true,
    })
    wallet_address?: string;

    @HasMany(() => Stream)
    streams!: Stream[];
}
