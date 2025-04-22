import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

import { Workflow } from "@/app/contracts/Workflows";
import { logger } from "@/libs/logger";
import { getTemporalClient, TASK_QUEUE_NAME } from "@/libs/temporal";
import { getFileExtension } from "@/libs/files";

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

    try {
      const fileExtension = getFileExtension(file.name);

      console.log({ fileExtension });

      // Step 1: create file details in db
      // const fileRecord = await createFileDetailsInDB({});

      // Step 2: upload to S3
      try {
        // this may be breaking change - files before had uuid as name
        // but there wasn't a logic which used files, so it should still work
        // const uploadResult = await uploadToS3(
        //   `${fileRecord.public_id}.${fileExtension}`,
        //   parsedFile.content as Buffer
        // );

        // await db.userFile.update({
        //   where: {
        //     id: fileRecord.id,
        //     organization_id: orgId,
        //   },
        //   data: {
        //     is_uploaded: true,
        //     uploaded_at: new Date(),
        //   },
        // });

        // processedFiles.push({
        //   fileName: parsedFile.fileName,
        //   fileSize: file.size,
        //   uniqueFileId,
        //   content: parsedFile.content,
        // });

        // logger.info(`File uploaded to S3: ${parsedFile.fileName}`);

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
        logger.error(
          { err }
          // `Error uploading file to S3: ${parsedFile.fileName}`
        );

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
