import { Request, Response } from "express";
import { Stream } from "../model/Stream";
import { StreamRepo } from "../repository/StreamRepo";

class StreamController {
  async create(req: Request, res: Response) {
    try {
      const {
        stream_id,
        creator,
        recipients,
        rate_per_millisecond,
        token_type,
        total_deposited_amount,
        start_time,
        stop_time,
        remaining_balance,
        deposited_amount,
      } = req.body;

      const streamsToSave = [];

      for (let i = 0; i < recipients.length; i++) {
        const new_stream = new Stream();
        new_stream.stream_id = stream_id;
        new_stream.creator = creator;
        new_stream.recipient = recipients[i];
        new_stream.rate_per_millisecond = rate_per_millisecond[i];
        new_stream.token_type = token_type;
        new_stream.total_deposited_amount = total_deposited_amount;
        new_stream.remaining_balance = remaining_balance[i];
        new_stream.deposited_amount = deposited_amount[i];
        new_stream.start_time = start_time;
        new_stream.stop_time = stop_time;
        new_stream.user_id = req.user as number;

        streamsToSave.push(new_stream);
      }

      for (const stream of streamsToSave) {
        await new StreamRepo().save(stream);
      }

      res.status(201).json({
        status: "Created!",
        message: "Successfully created streams!",
      });
    } catch (err) {
      console.error("error in this function 1 ", err);

      res.status(500).json({
        status: "Internal Server Error",
        message: "Failed to create streams",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      let streamId = req.params["streamId"].toString();

      await new StreamRepo().delete(streamId);

      res.status(200).json({
        status: "Ok!",
        message: "Sucessfully deleted stream!",
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  async retrieveAllIncoming(req: Request, res: Response) {
    const walletAddress = req.query.walletAddress;

    if (!walletAddress) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Missing walletAddress query parameter",
      });
    }
    const user_id: number = req.user as number;

    if (!user_id) {
      throw new Error("User id missing");
    }

    try {
      const new_stream = await new StreamRepo().retrieveAllIncoming(
        user_id,
        walletAddress as string
      );

      // Send successful response
      res.status(200).json({
        status: "Ok!",
        message: "Successfully fetched incoming stream!",
        data: new_stream,
      });
    } catch (err: any) {
      console.error("error in this function 2 ", err);

      res.status(500).json({
        status: "Internal Server Error",
        message: err.message || "Internal Server Error",
      });
    }
  }

  async retrieveAllOutgoing(req: Request, res: Response) {
    const user_id: number = req.user as number;
    const walletAddress = req.query.walletAddress;

    try {
      const new_stream = await new StreamRepo().retrieveAllOutgoing(
        user_id,
        walletAddress as string
      );

      res.status(200).json({
        status: "Ok!",
        message: "Sucessfully fetched outgoing stream!",
        data: new_stream,
      });
    } catch (err) {
      console.error("error in this function 3 ", err);

      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      let id = parseInt(req.params["id"]);
      const new_stream = await new StreamRepo().retrieveById(id);

      res.status(200).json({
        status: "Ok!",
        message: "Sucessfully fetched stream details!",
        data: new_stream,
      });
    } catch (err) {
      console.error("error in this function 444 ", err);

      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }

  // async update(req: Request, res: Response) {
  //   try {
  //     let id = parseInt(req.params["id"]);
  //     const new_stream = new Stream();

  //     new_stream.id = id;
  //     new_stream.stream_id = req.body.stream_id;
  //     new_stream.creator = req.body.creator;
  //     new_stream.recipient = req.body.recipient;
  //     new_stream.rate_per_millisecond = req.body.rate_per_millisecond;
  //     new_stream.token_type = req.body.token_type;
  //     new_stream.total_deposited_amount = req.body.total_deposited_amount;
  //     new_stream.remaining_balance = req.body.remaining_balance;
  //     new_stream.deposited_amount = req.body.deposited_amount;
  //     new_stream.start_time = req.body.start_time;
  //     new_stream.stop_time = req.body.stop_time;

  //     await new StreamRepo().update(new_stream);

  //     res.status(200).json({
  //       status: "Ok!",
  //       message: "Sucessfully updated stream!",
  //       data: new_stream,
  //     });
  //   } catch (err) {
  //     res.status(500).json({
  //       status: "Internal Server Error",
  //       message: "Internal Server Error",
  //     });
  //   }
  // }

  async update(req: Request, res: Response) {
    
    const walletAddress = req.query.walletAddress;
    const { withdrawnAmount, streamId } = req.body;

    try {
      await new StreamRepo().withdrawStream(
        streamId,
        walletAddress as string,
        withdrawnAmount
      );

      res.status(200).json({
        status: "Ok!",
        message: "Sucessfully withdrawn from stream",
      });
    } catch (err) {
      res.status(500).json({
        status: "Internal Server Error",
        message: "Internal Server Error",
      });
    }
  }
}


export default new StreamController();
