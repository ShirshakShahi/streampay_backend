import { User } from "../model/User";

interface IUserRepo {
    save(wallet_address: String): Promise<User>
    delete(wallet_address: string): Promise<void>
    getById(user_id: number): Promise<User>
    getByWallet(wallet_address: string): Promise<User | null>
}

export class UserRepo implements IUserRepo {
    async save(wallet_address: String): Promise<User> {
        try {
          const user =  await User.create({
                wallet_address: wallet_address
            })

            return user;
        } catch (err) {
            throw new Error("Failed to save user")
        }
    }

    async delete(wallet_address: string): Promise<void> {
        try {
            const user = await User.findOne({
                where: {
                    wallet_address: wallet_address
                }
            })
            if (!user) {
                throw new Error("User not found!")
            }
            await user.destroy();
        } catch (err) {
            throw new Error("Failed to delete User")
        }
    }

    async getById(user_id: number): Promise<User> {
        try {
            const user = await User.findOne({
                where: {
                    id: user_id
                }
            })
            if (!user) {
                throw new Error("User not found!")
            }
            return user;
        } catch (err) {
            throw new Error("Failed to delete User")
        }
    }

    async getByWallet(wallet_address: string): Promise<User| null> {
        try {
            const user = await User.findOne({
                where: {
                    wallet_address: wallet_address
                }
            })
            if (!user) {
               return null;
            }
            return user;
        } catch (err) {
            throw new Error("Failed to get wallet address")
        }
    }

}