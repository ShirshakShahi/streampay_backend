import express, { Application, Request, Response } from "express";
import Database from "../utils/database";
import StreamRouter from "./router/StreamRouter";
import { UserRepo } from "./repository/UserRepo";
import cors from "cors";

declare global {
    namespace Express {
        interface Request {
            user?: Number;
        }
    }
}

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.databaseSync();
        this.plugins(); 
        this.routes();
    }

    protected databaseSync(): void {
        const db = new Database();
        db.sequelize?.sync();
    }

    protected plugins(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    protected routes(): void {
        this.app.route("/").get((req: Request, res: Response) => {
            res.send("welcome home");
        });
        
        this.app.use("/api/v1/stream", this.setUserFromQuery, StreamRouter); 
    }

    private setUserFromQuery(req: Request, res: Response, next: Function) {
        const userRepo = new UserRepo();
        const walletAddress = req.query.walletAddress?.toString();

        console.log("control reached here 1")
        
        if (!walletAddress) {
            return res.status(400).send("Missing walletAddress query parameter");
        }
        
        console.log("in between set user from query", walletAddress.toString());
        
        userRepo.getByWallet(walletAddress.toString())
        .then(user => {
            if (!user) {
                userRepo.save(walletAddress.toString())
                .then(newUser => {
                    req.user = newUser.id;
                    console.log("control reached here 2",req.user)
                    next(); 
                })
                .catch(err => {
                    console.error("Error creating user:", err);
                    res.status(500).send("Internal Server Error");
                });
            } else {
                req.user = user.id;
                console.log("control reached here 3",req.user)
                    next(); 
                }
            })
            .catch(err => {
                console.error("Error fetching user:", err);
                res.status(500).send("Internal Server Error");
            });
    }
}

const port: number = 3002;
const app = new App().app;

app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
});
