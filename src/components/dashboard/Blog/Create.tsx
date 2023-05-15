import { Banner, Button, ButtonGroup, Checkbox, FormLayout, LegacyCard, Modal, Page, TextField, Thumbnail, ContextualSaveBar, DropZone, LegacyStack, Text, Toast } from '@shopify/polaris'
import axios from 'axios';
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ManualInfo {
    name: string,
}

const CreateColletion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathName = location.pathname;
    const pathNameSplit =  pathName.split("/");

    const id = pathNameSplit[pathNameSplit.length - 1];
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File>();
    const [fileData, setFileData] = useState<string | ArrayBuffer | null>();
    const [activeToast, setActiveToast] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const toggleActive = useCallback(() => setActiveToast((active) => !active), []);

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>{
            const reader = new FileReader()
            reader.readAsDataURL(acceptedFiles[0])
            reader.onloadend = () =>{
                setFileData(reader.result)
            }
            setFile(acceptedFiles[0])
    },[]);

    let fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
        <LegacyStack>
            <Thumbnail
                size="small"
                alt={file.name}
                source={
                    window.URL.createObjectURL(file)
                }
            />
            <div>
                {file.name}{" "}
                <Text variant="bodySm" as="p">
                    {file.size} bytes
                </Text>
            </div>
        </LegacyStack>
    );

    const getBlog = useCallback(async() =>{
        const response = await axios.get(`http://localhost:4000/api/blog/get-blog-by-id?id=${id}`);
        if(response.data.success){
            setTitle(response.data.data.title)
            setContent(response.data.data.content)
        }
    },[id])
    
    const handleSave = async () =>{
        const saveReq =  await axios.post("http://localhost:4000/api/blog/create", {
            id: id,
            title: title,
            image: fileData,
            content: content
        })

        if(saveReq.data.success){
            if(id === "create"){
                setMessage("Tạo mới bài viết thành công")
            }else{
                setMessage("Cập nhật bài viết thành công")
            }
            setActiveToast(true)
            navigate("/blog")
        }else{
            if(id === "create"){
                setMessage("Tạo mới bài viết thất bại")
            }else{
                setMessage("Cập nhật bài viết thất bại")
            }
            setError(true)
            setActiveToast(true)
        }
    }


    const contextualSaveBarMarkup = (title !== "" || content !== "") ? (
        <ContextualSaveBar
        saveAction={{
            onAction: handleSave,
            content: "Lưu"
        }}/>) : null
    
    useEffect(() =>{
        if(id !== "create"){
            getBlog().then()
        }
    },[])

    const toastMarkup = activeToast ? (
        <Toast content={message} onDismiss={toggleActive} error={error}/>
    ) : null;

    return (
        <Page>
            {contextualSaveBarMarkup}
            {toastMarkup}
            <LegacyCard
                title="Thông tin mã giảm giá"
            >
                <LegacyCard.Section>
                    <FormLayout>
                        <TextField 
                            label="Tên bài viết"
                            placeholder='Tên bài viết' 
                            autoComplete='false' 
                            value={title} 
                            onChange={(value) => setTitle(value)}
                        />
                        <DropZone
                        allowMultiple={false}
                        onDrop={handleDropZoneDrop}
                        label="Ảnh bài viết (1 ảnh đại diện)"
                        >
                            {uploadedFile}
                            {fileUpload}
                        </DropZone>
                    </FormLayout>
                </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard title="Nội dung bài viết">
                <LegacyCard.Section>
                    <FormLayout>
                        <TextField 
                            multiline
                            placeholder='Nội dung'
                            autoComplete='false'
                            value={content}
                            onChange={(value) =>setContent(value)}
                        />
                    </FormLayout>
                    
                </LegacyCard.Section>
            </LegacyCard>
        </Page>
    )
}

export default CreateColletion