"use client";

import { useState } from "react";
import {
    DragAndDropBox,
    DragAndDropBoxDescription,
    DragAndDropBoxIcon,
    DragAndDropBoxTitle
} from "~/components/drag-n-drop-box";

interface CreateWatermarkProps {
    title: string;
    desc: string;
}

export default function CreateWatermark(
    {
        title,
        desc
    }: CreateWatermarkProps
) {
    const [originalImg, setOriginalImg] = useState<null | File>(null);
    const hOriginalImgChange = (file: File) => {
        setOriginalImg(file);
    };
    return(
        <DragAndDropBox
            handleFileChange={hOriginalImgChange}
        >
            <DragAndDropBoxIcon name={"Add"}/>
            <DragAndDropBoxTitle>
                {title}
            </DragAndDropBoxTitle>
            <DragAndDropBoxDescription>
                {desc}
            </DragAndDropBoxDescription>
        </DragAndDropBox>
    )
}