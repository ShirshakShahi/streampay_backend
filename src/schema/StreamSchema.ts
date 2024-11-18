import { z } from "zod";

export const createStreamSchema = 
    z.object({
        stream_id: z.string().min(1, { message: "Stream Id must be greater than 1" }),
        creator: z.string().min(1, { message: "Creator must be greater than 1" }),
        recipients: z.array(z.string()).nonempty({ message: "At least one recipient is required" }),
        rate_per_millisecond: z.array(z.number()).min(1, { message: "At least one rate must be provided" }),
        token_type: z.string().min(1, { message: "Token Type must be greater than 1" }),
        total_deposited_amount: z.number().min(0, { message: "Total Deposited Amount must be greater than or equal to 0" }),
        remaining_balance: z.array(z.number()).min(1, { message: "At least one remaining balance must be provided" }),
        deposited_amount: z.array(z.number()).min(1, { message: "At least one deposited amount must be provided" }),
        start_time: z.number().min(0, { message: "Start Time must be a positive number" }),
        stop_time: z.number().min(0, { message: "Stop Time must be a positive number" }),
    });

export const updateStreamSchema = z.object({
    params: z.object({
        id: z.string(),
        body: z.object({
            stream_id: z.string().min(1, { message: "Stream Id must be greater than 1" }),
            creator: z.string().min(1, { message: "Creator must be greater than 1" }),
            recipients: z.array(z.string().min(1, { message: "Recipient must be greater than 1" })).optional(), // Changed to an array and made optional
            rate_per_millisecond: z.array(z.number().min(0, { message: "Rate Per Millisecond must be greater than 0" })).optional(), // Changed to an array and made optional
            token_type: z.string().min(1, { message: "Token Type must be greater than 1" }),
            total_deposited_amount: z.number().min(0, { message: "Total Deposited Amount must be greater than 0" }), // Corrected message
            remaining_balance: z.array(z.number().min(0, { message: "Remaining Balance must be greater than 0" })).optional(), // Changed to an array and made optional
            deposited_amount: z.array(z.number().min(0, { message: "Deposited Amount must be greater than 0" })).optional(), // Changed to an array and made optional
            start_time: z.number().min(0, { message: "Start Time must be greater than 0" }), // Corrected message
            stop_time: z.number().min(0, { message: "Stop Time must be greater than 0" }), // Corrected message
            type: z.boolean().optional(), // Made optional
        }).partial()
    })
});
