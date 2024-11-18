import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: Stream.STREAM_TABLE_NAME,
    timestamps: true,
})
export class Stream extends Model {
    public static STREAM_TABLE_NAME = "stream";
    public static ID = "id";
    public static STREAM_ID = "stream_id";
    public static CREATOR = "creator";
    public static RECIPIENT = "recipient";
    public static RATE_PER_MILLISECOND = "rate_per_millisecond";
    public static TOKEN_TYPE = "token_type";
    public static TOTAL_DEPOSITED_AMOUNT = "total_deposited_amount";
    public static REMAINING_BALANCE = "remaining_balance";
    public static DEPOSITED_AMOUNT = "deposited_amount";
    public static START_TIME = "start_time";
    public static STOP_TIME = "stop_time";

    public static USER_ID = "user_id"; // Foreign key to the User model

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: Stream.ID,
    })
    id!: number;

    @Column({
        type: DataType.STRING(100),
        field: Stream.STREAM_ID,
        allowNull: false,
        // unique: true,
    })
    stream_id!: string;

    @Column({
        type: DataType.STRING(100),
        field: Stream.CREATOR,
        allowNull: false,
    })
    creator!: string;

    @Column({
        type: DataType.STRING(100),
        field: Stream.RECIPIENT,
        allowNull: true,
    })
    recipient?: string;

    @Column({
        type: DataType.INTEGER,
        field: Stream.RATE_PER_MILLISECOND,
        allowNull: false,
    })
    rate_per_millisecond!: number;

    @Column({
        type: DataType.STRING(100),
        field: Stream.TOKEN_TYPE,
        allowNull: true,
    })
    token_type?: string;

    @Column({
        type: DataType.INTEGER,
        field: Stream.TOTAL_DEPOSITED_AMOUNT,
        allowNull: false,
    })
    total_deposited_amount!: number;

    @Column({
        type: DataType.INTEGER,
        field: Stream.REMAINING_BALANCE,
        allowNull: false,
    })
    remaining_balance!: number;

    @Column({
        type: DataType.INTEGER,
        field: Stream.DEPOSITED_AMOUNT,
        allowNull: false,
    })
    deposited_amount!: number;

    @Column({
        type: DataType.BIGINT,
        field: Stream.START_TIME,
        allowNull: false,
    })
    start_time!: number;

    @Column({
        type: DataType.BIGINT,
        field: Stream.STOP_TIME,
        allowNull: false,
    })
    stop_time!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        field: Stream.USER_ID,
        allowNull: false,
    })
    user_id!: number;

    @BelongsTo(() => User)
    user!: User;
}
