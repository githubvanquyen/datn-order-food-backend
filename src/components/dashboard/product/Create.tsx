import {
    AlphaCard,
    AlphaStack,
    Banner,
    Bleed,
    Box,
    Button,
    ContextualSaveBar,
    DropZone,
    FormLayout,
    LegacyStack,
    Modal,
    Page,
    ResourceItem,
    ResourceList,
    Text,
    TextField,
    Thumbnail,
} from "@shopify/polaris";

import { NoteMinor, PlusMinor, DeleteMinor } from "@shopify/polaris-icons";
import axios, { Axios } from "axios";
import { useCallback, useState, useRef, useReducer, useEffect, useMemo, JSXElementConstructor } from "react";
import { useLocation } from "react-router-dom";

interface collectionData{
    name: string
    id: number
    image: string
}
interface initialCollectionState {
    status: boolean
    searchText: string
    data: collectionData[]
    collectionSelected: collectionData[]
}

interface initialVariantState {
    statusOpen: boolean
    optionName: string[][]
    optionType: string[]
    optionPrice: number[][]
}


interface initialCollectionPayload {
    status?: boolean
    searchText?: string
    data?: collectionData[]
    collectionSelected?: collectionData[]
}

interface initialVariantPayload {
    statusOpen?: boolean
    optionName?: string[][]
    optionType?: string[]
    optionPrice?: number[][]
}

const collectionReducer = (state: initialCollectionState, payload: initialCollectionPayload) =>{
    return {...state, ...payload}
}

const variantReducer = (state: initialVariantState, payload: initialVariantPayload) =>{
    return {...state, ...payload}
}
const Create = () => {
    const inputDefault = useRef({
        name: "",
        regularPrice: "",
        salePrice: "",
        description: "",
    })
    const [input, setInput] = useState({
        name: "",
        regularPrice: "",
        salePrice: "",
        description: "",
    });

    const [collection, dispatch] = useReducer(collectionReducer, {
        status: false,
        searchText: "",
        data: [],
        collectionSelected: []
    })

    const location = useLocation()

    const [file, setFile] = useState<File>();
    const [fileData, setFileData] = useState<string | ArrayBuffer | null>();
    const [variantOptionMarkUp, setVariantOptionMarkUp] = useState<JSX.Element[] | null> (null);
    const [variant, dispatchVariant] = useReducer(variantReducer, {
        optionName: [],
        optionType: [],
        optionPrice: [],
        statusOpen: false
    })

    const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>{
        const reader = new FileReader()
        reader.readAsDataURL(acceptedFiles[0])
        reader.onloadend = () =>{
            setFileData(reader.result)
        }
        setFile(acceptedFiles[0])
    },[]);

    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    let fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
        <LegacyStack>
            <Thumbnail
                size="small"
                alt={file.name}
                source={
                    validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
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

    const handleSave = useCallback(async() =>{
        const response = await axios.post("http://localhost:4000/api/product/create",{
            name: input.name,
            description: input.description,
            regularPrice: input.regularPrice,
            salePrice: input.salePrice,
            image: fileData,
            collectionId: collection.collectionSelected[0].id,
            variantName: variant.optionName,
            variantPrice: variant.optionPrice,
            variantType: variant.optionType
        })  
        console.log(response.data);
    },[input, collection, variant])

    const contextualSaveBarMarkup = (JSON.stringify(input) !== JSON.stringify(inputDefault.current)) ? (
        <ContextualSaveBar
        saveAction={{
            onAction: handleSave,
            content: "Save"
        }}/>) : null

    useEffect(() =>{
        const fetchCollection = async () =>{
            const response = await axios.get(`http://localhost:4000/api/collection/get-collection-by-name?name=${collection.searchText}`)
            if(response.data.success){
                dispatch({data: response.data.data})
            }
        }
        fetchCollection().then()
    },[collection.searchText])
    
    const handleActionNewOption = () =>{
        dispatchVariant({statusOpen: true, optionType: [...variant.optionType, ""], optionPrice: [...variant.optionPrice, [0]], optionName: [...variant.optionName, [""]]})
    }

    const handleSelectedCollection = useCallback((item: collectionData) =>{
        const hasSelected = collection.collectionSelected.filter((selected) =>{selected.id === item.id})
        if(hasSelected.length == 0){
            dispatch({collectionSelected: [item], status: false})
        }
    },[collection.data])

    const handleRemoveVariantItem = (index: number, indexI: number) =>{
        dispatchVariant({
            optionName: variant.optionName.map((variant, indexV) => (indexV === index) ? variant.filter((item, i) => (i !== indexI)): variant),
            optionPrice: variant.optionPrice.map((price, indexV) => (indexV === index) ? price.filter((item, i) =>(i !== indexI)) : price)
        })
    }

    const variantMarkup = useMemo(() => {
            return (variant.statusOpen && variant.optionType.length > 0) ? variant.optionType.map((item, index) =>{
                return (<div key={index} style={{marginBottom: '16px'}}>
                    <TextField 
                        label="Loại tùy chọn" 
                        value={item} 
                        onChange={(value) => {
                            dispatchVariant({optionType: variant.optionType.map((item, indexT) => indexT === index ? value : item)})
                        }}
                        autoComplete="off"
                        />
                        <div style={{margin: "16px 0px 4px 24px"}}>Tên tùy chọn</div>
                        <div style={{ paddingLeft: '24px'}}>
                        {
                            variant.optionName[index].map((optionName, indexo) =>{
                                return(
                                    <div style={{ marginBottom: "8px", display: "flex", alignItems:"center"}} key={indexo}>
                                        <div style={{flex: 1, paddingRight: "12px"}}>
                                            <TextField 
                                                placeholder="thêm tùy chọn khác"
                                                label="" 
                                                value={optionName}
                                                onChange={(value) =>{
                                                    dispatchVariant({optionName: variant.optionName.map((variant, indexVs) => (indexVs === index) ? (variant.map((item, indexV) => (indexV === indexo) ? value : item)) : variant)})
                                                }}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div style={{ flexBasis: "40%", paddingRight: "12px"}}>
                                            <TextField
                                                placeholder="giá"
                                                label=""
                                                value={variant.optionPrice[index][indexo].toString()}
                                                onChange={(value) =>{
                                                    dispatchVariant({optionPrice: variant.optionPrice.map((price, indexVs) => (indexVs === index) ? (price.map((item, indexV) => (indexV === indexo) ? +value : item)) : price)})
                                                }}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <Button icon={DeleteMinor} onClick={() => handleRemoveVariantItem(index,indexo)}/>
                                        
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                )
            }) : null
        
    }, [variant])

    useEffect(() =>{
        const checkAddNewOption = variant.optionName.filter((item) => item[item.length - 1] !== "")
        if(checkAddNewOption && checkAddNewOption.length > 0){
            let index = 0;
            const variantChanged = variant.optionName.map((variants, indexI) =>{
                if(variants && variants.length > 0 && variants[variants.length - 1] !== ""){
                    variants.push("");
                    index = indexI;
                    return (variants)
                }
                return variants
            })

            const variantChanged2 = variant.optionPrice.map((variants2, indexI) =>{
                if(variants2 && variants2.length > 0 && index === indexI){
                    variants2.push(0);
                    return (variants2)
                }
                return variants2
            })
            dispatchVariant({optionName: variantChanged, optionPrice: variantChanged2})
        }
        setVariantOptionMarkUp(variantMarkup)
        console.log(variant);
        
    }, [variant])

    const handleModalCollection = useCallback(() =>{
        dispatch({status: true});
    },[])

    const handleChangeCollectionSearch = useCallback((value: string) =>{
        dispatch({searchText: value})
    },[])

    const handleNameChange = useCallback((value: string) => {
        setInput((pre) => ({ ...pre, name: value }));
    }, []);

    const handleRegularPriceChange = useCallback((value: string) => {
        setInput((pre) => ({ ...pre, regularPrice: value }));
    }, []);

    const handleSalePriceChange = useCallback((value: string) => {
        setInput((pre) => ({ ...pre, salePrice: value }));
    }, []);

    const handleDescriptionChange = useCallback((value: string) => {
        setInput((pre) => ({ ...pre, description: value }));
    }, []);

    useEffect(() =>{
        const fetchData = async () =>{
            if(location.pathname.indexOf("create") === -1){
                const urlSplit =  location.pathname.split("/");
                const id = urlSplit[urlSplit.length - 1];
                const response =  await axios.get(`http://localhost:4000/api/product/get-product-by-id?id=${id}`);
                if(response.data.success){
                    const {name, description, regularPrice, salePrice, collection, image, variants} = response.data.data
                    setInput((pre) => ({...pre, name: name, description:description, regularPrice:regularPrice, salePrice: salePrice }))
                    dispatch({collectionSelected: [collection]})
                    let optionTypes=  variants.map((item: any) => {
                        return item.title
                    })

                    let optionNames =  variants.map((item: any) =>{
                        return [...JSON.parse(item.value), ""];
                    })

                    let optionPrices =  variants.map((item: any) =>{
                        return [...JSON.parse(item.price), 0];
                    })
                    dispatchVariant({optionName: optionNames, optionType: optionTypes, optionPrice: optionPrices, statusOpen: true })
                }              
                
            }
        }
        fetchData().then(() =>{})
    },[])
    

    return (
        <Page>
            {contextualSaveBarMarkup}
            <AlphaCard>
                <Box padding="4">
                    <Bleed marginInline="4">
                        <Text variant="headingMd" as="h3">
                            Thông tin sản phẩm
                        </Text>
                    </Bleed>
                </Box>
                <FormLayout>
                    <TextField
                        label="Tên sản phẩm"
                        value={input.name}
                        onChange={handleNameChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Giá gốc"
                        value={input.regularPrice}
                        onChange={handleRegularPriceChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Giá bán"
                        value={input.salePrice}
                        onChange={handleSalePriceChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Mô tả"
                        value={input.description}
                        onChange={handleDescriptionChange}
                        autoComplete="off"
                    />
                    <DropZone
                        allowMultiple={false}
                        onDrop={handleDropZoneDrop}
                        label="Ảnh sản phẩm (1 ảnh đại diện)"
                    >
                        {uploadedFile}
                        {fileUpload}
                    </DropZone>
                </FormLayout>
            </AlphaCard>
            <Box padding={"2"}/>
            <AlphaCard>
                <Box padding="4">
                    <Bleed marginInline="4">
                        <Text variant="headingMd" as="h3">
                            Danh mục sản phẩm
                        </Text>
                    </Bleed>
                </Box>
                <TextField
                    label="Tìm kiếm danh mục"
                    value={collection.searchText}
                    onFocus={handleModalCollection}
                    autoComplete="off"
                />

                {
                    collection.collectionSelected.length > 0 ?
                    collection.collectionSelected.map(item => (
                        <div style={{paddingTop: '12px'}} key={item.id}>
                            <Banner key={item.id} onDismiss={() => dispatch({collectionSelected: []})}>
                                <p>{item.name}</p>
                            </Banner>
                        </div>
                    ))
                    : null
                }
            </AlphaCard>
            <Box padding={"2"}/>
            <AlphaCard>
                <Box padding="4">
                    <Bleed marginInline="4">
                        <Text variant="headingMd" as="h3">
                            Tùy chọn
                        </Text>
                    </Bleed>
                </Box>
                <FormLayout>
                {variantOptionMarkUp}
                </FormLayout> 
                <Button fullWidth icon={PlusMinor} outline={false} onClick={() => handleActionNewOption()}>Thêm tùy chọn mới</Button>
            </AlphaCard>
            <Modal
                open={collection.status}
                onClose={() => dispatch({status: false})}
                title="Danh mục sản phẩm"
                primaryAction={{
                    content: "Chọn",
                    onAction: () => { dispatch({status: false })}
                }}
            >
                <Modal.Section>
                    <TextField
                        label=""
                        value={collection.searchText}
                        onChange={handleChangeCollectionSearch}
                        autoFocus={true}
                        autoComplete="off"
                    />
                    <div style={{padding: '8px 0px'}}/>
                    {
                        collection.data.length > 0 ? <ResourceList
                            items={collection.data}
                            renderItem={(item: collectionData) =>{
                                return <ResourceItem key={item.id} id={item.id.toString()} onClick={() => {handleSelectedCollection(item)}}>
                                    {item.name}
                                </ResourceItem>
                            }}
                        />: null
                    }
                </Modal.Section>
            </Modal>
        </Page>
    );
};

export default Create;
