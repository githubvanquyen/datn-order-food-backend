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
    const [manualInfo, setManualInfo] = useState<ManualInfo>({
        name: "",
    })
    const [productTitle, setProductTitle] = useState("");
    const [active, setActive] = useState(false);
    const [products, setProducts] = useState([])
    const [idProductSelected, setIdProductSelected] = useState<number[]>([]);
    const [productSelected, setProductSelected] = useState([]);
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
    
    const handleChangeManualInfoNameCollection = (value: string) =>{
        setManualInfo(pre => ({...pre, name: value}))
    }

    const handleChange = useCallback(() => setActive(!active), [active]);
    const fetchProduct = useCallback(async () =>{
        if(productTitle !== ""){
            const response = await axios.get(`http://localhost:4000/api/product/get-product-by-name?name=${productTitle}`)
            if(response.data.success){
                setProducts(response.data.data)
            }
        }else{
            const response = await axios.get(`http://localhost:4000/api/product/get-all-product`)
            if(response.data.success){
                setProducts(response.data.data)
            }
        }
    },[productTitle])

    const getCollection = useCallback(async() =>{
        const response = await axios.get(`http://localhost:4000/api/collection/get-collection-by-id?id=${id}`);
        if(response.data.success){
            setManualInfo((pre) => ({
                ...pre, 
                name: response.data.data.name,
                image: response.data.data.image
            }))
            if(response.data.data.products !== null){
                setProductSelected(response.data.data.products)
                setIdProductSelected(response.data.data.products.map((item: any) => item.id));
            }
        }
    },[id])

    useEffect(() => {
        fetchProduct().then()
    }, [productTitle])

    const handleChangeSelectedProduct = (checked: boolean, id: string) =>{
        let ids = Number(id);
        
        if(idProductSelected.indexOf(ids) !== -1) {
            const selected = idProductSelected.filter((product) => product !== ids)
            setIdProductSelected(selected);
            setProductSelected((pre) => pre.filter((item: any) => item.id !== ids) );
        }else{
            setIdProductSelected((pre) => ([...pre, ids]))    
            const selected = products.filter((item: any) => item.id === ids)
            setProductSelected((pre) => [...pre, selected[0]])        
        }
    }

    const handleDismisProductSelected = (id: any) =>{
        const ids = Number(id);
        const selected = idProductSelected.filter((product) => product !== ids)
        setIdProductSelected(selected);
        setProductSelected((pre) => pre.filter((item: any) => item.id !== ids) );
    }

    const productMarkup = products && products.map((product:{id: number, image: string, name: string}) =>{
        return <div key={product.id} className='product-search-list'>
            <Checkbox 
                key={product.id}
                id={product.id+ ""}
                label={<Thumbnail source={product.image} alt='product-image' />} 
                checked={idProductSelected.includes(product.id)} 
                onChange={handleChangeSelectedProduct}
            />
            {product.name}
        </div>;
    })
    
    const handleSave = async () =>{
        const saveReq =  await axios.post("http://localhost:4000/api/collection/create", {
            id: id,
            name: manualInfo.name,
            image: fileData,
            productIds: idProductSelected
        })

        if(saveReq.data.success){
            if(id === "create"){
                setMessage("Tạo mới danh mục sản phẩm đồ ăn thành công")
            }else{
                setMessage("Cập nhật danh mục sản phẩm đồ ăn thành công")
            }
            setActiveToast(true)
            navigate("/collection")
        }else{
            if(id === "create"){
                setMessage("Tạo mới danh mục sản phẩm đồ ăn thất bại")
            }else{
                setMessage("Cập nhật danh mục sản phẩm đồ ăn thất bại")
            }
            setError(true)
            setActiveToast(true)
        }
    }


    const contextualSaveBarMarkup = (JSON.stringify(manualInfo) !== JSON.stringify({
        name: "",
    })) ? (
        <ContextualSaveBar
        saveAction={{
            onAction: handleSave,
            content: "Lưu"
        }}/>) : null
    
    useEffect(() =>{
        if(id !== "create"){
            getCollection().then()
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
                            label="Tên danh mục sản phẩm"
                            placeholder='Tên danh mục sản phẩm' 
                            autoComplete='false' 
                            value={manualInfo.name} 
                            onChange={handleChangeManualInfoNameCollection}
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
                </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard title="Sản phẩm thuộc danh mục sản phẩm">
                <LegacyCard.Section>
                    <FormLayout>
                        <TextField 
                            placeholder='Tên sản phẩm'
                            autoComplete='false'
                            value={productTitle}
                            onFocus={handleChange}
                            onChange={(value) =>setProductTitle(value)}
                        />
                    </FormLayout>
                    {
                        productSelected.length > 0 ? productSelected.map((product: any) => ( 
                        <div style={{paddingTop: '12px'}} key={product.id}>
                        <Banner key={product.id} onDismiss={() => handleDismisProductSelected(product.id)} hideIcon>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Thumbnail source={product.image} alt='product-image' />
                                <span style={{ marginLeft: "12px" }}>{product.name}</span>
                            </div>
                        </Banner>
                    </div>
                            )) : null
                    }
                    <Modal
                        open={active}
                        onClose={handleChange}
                        title="Danh sách sản phẩm"
                        primaryAction={{
                            content: 'Thêm',
                            onAction: handleChange,
                        }}
                    >
                        <Modal.Section>
                        <TextField placeholder='Tên product' autoComplete='false' autoFocus value={productTitle} onChange={(value) => setProductTitle(value)}/>
                        {productMarkup}
                        </Modal.Section>
                    </Modal>
                </LegacyCard.Section>
            </LegacyCard>
        </Page>
    )
}

export default CreateColletion