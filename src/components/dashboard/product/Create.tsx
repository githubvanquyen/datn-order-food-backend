import { Alert, AlertTitle, Box, Button, Stack, TextField } from "@mui/material"
import * as React from 'react';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from "axios";
import { IResponse } from "../../../utils/type";

interface IInput {
    name: String,
    regularPrice: String,
    salePrice: String,
    description: string | readonly string[] | undefined,
    image: String | null | ArrayBuffer
}

const Create = () => {
    const [input, setInput] = React.useState<IInput>({
        name: "",
        regularPrice: "",
        salePrice:"",
        description: "",
        image:"",
    });

    const [toast, setToast] = React.useState(false);

    const addEmoji = (emoji: string) => () => setInput({...input, description: `${input.description}${emoji}`});

    const handleFileInputChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files && e.target.files?.length > 0 && e.target.files[0];
        if(file && file !== null){
            previewFile(file)
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setInput((pre) =>({...pre, [e.target.name]: e.target.value}))
    } 

    const previewFile = (file: File) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setInput((pre) => ({...pre, image: reader.result}));
        }
    }

    const handleSubmit = async () =>{
        try {
            const response = await axios.post<IResponse>("http://localhost:4000/product/create",{...input})
            if(response.data.success){
                setToast(true);
                setInput({name: "", description: "", image: "",regularPrice:"", salePrice:""})
            } 
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Box
        sx={{'& .MuiTextField-root': { m: 1, width: '100%' }}}
    >
        <Box sx={{m:1}}>
            {
            toast && <Alert severity="success" >
                <AlertTitle>Success</AlertTitle>
                Add new product successfully
            </Alert>
            }
        </Box>
        <Box  sx={{display: 'flex', flexDirection: "row"}}>
            <TextField
                label="Name"
                variant="outlined"
                name="name"
                value={input.name}
                onChange={(event) => handleChangeInput(event)}
            />
        </Box>
        <Box 
            sx={{display: 'flex', flexDirection: "row"}}
        >
            <TextField 
                label="Regular price"
                variant="outlined"
                type="number"
                name="regularPrice"
                value={input.regularPrice}
                onChange={(event) => handleChangeInput(event)}
            />
            <TextField 
                label="Sale price"
                variant="outlined"
                type="number"
                name="salePrice"
                value={input.salePrice}
                onChange={(event) => handleChangeInput(event)}
            />
        </Box>
        <Box sx={{m: 1, display:'flex', alignItems:'center'}}>
        <Button variant="contained" component="label" sx={{mr: 1}}>
            Upload
            <input hidden accept="image/*" multiple type="file" onChange={handleFileInputChange} />
        </Button>
        <IconButton color="primary" aria-label="upload picture" component="label">
            <input hidden accept="image/*" type="file" />
            <PhotoCamera />
        </IconButton>
        {
            input.image && (<img src={input.image as string} alt="preview image" style={{ width: "300px"}}/>)
        }
        </Box>
        <Box sx={{m:1}}>
            <Textarea
                placeholder="Type description here…"
                name="description"
                value={input.description}
                onChange={(event) => handleChangeInput(event)}
                minRows={2}
                maxRows={4}
                startDecorator={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                        👍
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('🏖')}>
                        🏖
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('😍')}>
                        😍
                    </IconButton>
                    </Box>
                }
                endDecorator={
                    <Typography level="body3" sx={{ ml: 'auto' }}>
                    {input.description && input.description.length} character(s)
                    </Typography>
                }
                sx={{ minWidth: 300 }}
            />
        </Box>
        <Box>
            <Button variant="contained" size="medium" onClick={handleSubmit}>Save</Button>
        </Box>
    </Box>
  )
}

export default Create