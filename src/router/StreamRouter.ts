import BaseRoutes from "./base/BaseRouter";
import StreamController from "../controller/StreamController";
import validate from "../../utils/validate";
import { createStreamSchema, updateStreamSchema } from "../schema/StreamSchema";

class StreamRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("",validate(createStreamSchema), StreamController.create);
    this.router.patch("/update", StreamController.update);
    this.router.delete("/:streamId", StreamController.delete)
    this.router.get("/incoming", StreamController.retrieveAllIncoming);
    this.router.get("/outgoing", StreamController.retrieveAllOutgoing);
    this.router.get("/:id", StreamController.findById);
  }
}

export default new StreamRoutes().router;
