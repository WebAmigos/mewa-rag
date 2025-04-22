import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

import { Workflow } from "@/app/contracts/Workflows";
import { logger } from "@/libs/logger";
import { getTemporalClient, TASK_QUEUE_NAME } from "@/libs/temporal";
import { getFileExtension } from "@/libs/files";
import { uploadToS3 } from "@/libs/aws";
import db from "@/libs/db";
import { FileType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("user_file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file to process" },
        { status: 400 }
      );
    }

    const fileExtension = getFileExtension(file.name);
    const newFileName = `${uuidv4()}.${fileExtension}`;

    try {
      // Step 1: create file details in db
      // const fileRecord = await createFileDetailsInDB({});

      // Step 2: upload to S3
      try {
        // this may be breaking change - files before had uuid as name
        // but there wasn't a logic which used files, so it should still work

        // for text files, for binary use Buffer
        const content = await file.text();

        const uploadResult = await uploadToS3(newFileName, content);

        await db.userFile.create({
          data: {
            file_name: file.name,
            file_size: file.size,
            is_uploaded: true,
            is_binary_file: false,
            file_type: FileType.MARKDOWN,
            uploaded_at: new Date(),
          },
        });

        logger.info(`File uploaded to S3: ${newFileName}`);

        logger.info(`Started temporal workflow`);
        const embeddingWorkflowId = `file-${nanoid()}`;
        const client = getTemporalClient();

        // const embeddingsHandle = await client.workflow.start(
        //   Workflow.RUN_FILE_EMBEDDINGS,
        //   {
        //     taskQueue: TASK_QUEUE_NAME,
        //     workflowId: embeddingWorkflowId,
        //     args: [
        //       {
        //         ...fileRecord,
        //       },
        //     ],
        //   }
        // );

        // logger.info("embeddingsHandle: %j", embeddingsHandle, 2);
      } catch (err) {
        logger.error({ err }, `Error uploading file to S3: ${newFileName}`);

        return NextResponse.json({ status: "Upload error" }, { status: 500 });
      }
    } catch (error) {
      logger.error({ err: error }, `Error processing file ${file.name}`);
      return NextResponse.json(
        { message: `Error while processing the file ${file.name}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "All files are successfully processed",
      status: 200,
      // files: processedFiles,
    });
  } catch (error) {
    logger.error({ err: error }, "Error processing files");
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
