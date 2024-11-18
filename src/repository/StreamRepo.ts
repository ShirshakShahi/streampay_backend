import { Stream } from "../model/Stream";

interface IStreamRepo {
  save(stream: Stream): Promise<void>;
  update(stream: Stream): Promise<void>;
  delete(id: string): Promise<void>;
  retrieveById(id: number): Promise<Stream>;
  retrieveAllIncoming(
    user_id: number,
    walletAddress: string
  ): Promise<Stream[]>;
  retrieveAllOutgoing(
    user_id: number,
    walletAddress: string
  ): Promise<Stream[]>;
  withdrawStream(
    streamId: string,
    walletAddress: string,
    withdrawnAmount: number
  ): void;
}

export class StreamRepo implements IStreamRepo {
  async save(stream: Stream): Promise<void> {
    try {
      await Stream.create({
        stream_id: stream.stream_id,
        creator: stream.creator,
        recipient: stream.recipient,
        rate_per_millisecond: stream.rate_per_millisecond,
        token_type: stream.token_type,
        total_deposited_amount: stream.total_deposited_amount,
        remaining_balance: stream.remaining_balance,
        deposited_amount: stream.deposited_amount,
        start_time: stream.start_time,
        stop_time: stream.stop_time,
        user_id: stream.user_id,
      });
    } catch (err) {
      console.error("Error in save method:", err);
      throw new Error("Failed to save Stream");
    }
  }

  async update(stream: Stream): Promise<void> {
    try {
      const new_stream = await Stream.findOne({
        where: {
          id: stream.id,
        },
      });
      if (!new_stream) {
        throw new Error("Stream not found!");
      }
      new_stream.stream_id = stream.stream_id;
      new_stream.creator = stream.creator;
      new_stream.recipient = stream.recipient;
      new_stream.rate_per_millisecond = stream.rate_per_millisecond;
      new_stream.token_type = stream.token_type;
      new_stream.total_deposited_amount = stream.total_deposited_amount;
      new_stream.remaining_balance = stream.remaining_balance;
      new_stream.deposited_amount = stream.deposited_amount;
      new_stream.start_time = stream.start_time;
      new_stream.stop_time = stream.stop_time;

      await new_stream.save();
    } catch (err) {
      throw new Error("Failed to update Stream");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const new_stream = await Stream.findOne({
        where: {
          stream_id: id,
        },
      });
      if (!new_stream) {
        throw new Error("Stream not found!");
      }

      await new_stream.destroy();
    } catch (err) {
      throw new Error("Failed to delete Stream");
    }
  }

  async retrieveById(id: number): Promise<Stream> {
    try {
      const new_stream = await Stream.findOne({
        where: {
          id: id,
        },
      });
      if (!new_stream) {
        throw new Error("Stream not found!");
      }
      return new_stream;
    } catch (err) {
      throw new Error("Failed to retrieve stream by id");
    }
  }

  async retrieveAllIncoming(
    user_id: number,
    walletAddress: string
  ): Promise<Stream[]> {
    try {
      const new_stream = await Stream.findAll({
        where: {
          user_id: user_id,
          recipient: walletAddress,
        },
      });

      if (!new_stream || new_stream.length === 0) {
        throw new Error(
          "No streams found for the provided user_id and walletAddress"
        );
      }

      return new_stream;
    } catch (err) {
      console.error("Failed to retrieve incoming stream:", err);
      throw new Error("Failed to retrieve incoming stream");
    }
  }

  async retrieveAllOutgoing(
    user_id: number,
    walletAddress: string
  ): Promise<Stream[]> {
    try {
      const new_stream = await Stream.findAll({
        where: {
          user_id: user_id,
          creator: walletAddress,
        },
      });
      if (!new_stream) {
        throw new Error("Stream not found!");
      }
      return new_stream;
    } catch (err) {
      throw new Error("Failed to retrieve outgoing stream");
    }
  }

  async withdrawStream(
    streamId: string,
    walletAddress: string,
    withdrawnAmount: number
  ) {
    try {
      const stream = await Stream.findOne({
        where: {
          stream_id: streamId,
          recipient: walletAddress,
        },
      });

      if (!stream) {
        throw new Error("No stream found with this Stream Id");
      }

      await Stream.update(
        { remaining_balance: stream.remaining_balance - withdrawnAmount },
        {
          where: {
            stream_id: stream.stream_id,
            recipient: walletAddress,
          },
        }
      );
    } catch (err) {
      throw new Error(`Failed to withdraw from Stream`);
    }
  }
}
