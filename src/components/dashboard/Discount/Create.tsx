import { Banner, Button, ButtonGroup, Checkbox, FormLayout, LegacyCard, Modal, Page, TextField, Thumbnail, ContextualSaveBar } from '@shopify/polaris'
import axios from 'axios';
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ManualInfo {
    discountName: string,
    discountValue: string,
    discountType: boolean,
    minimumPrice: string,
    maximumDiscount: string,
    expiredDate: string,
    quantity: string,
}

const CreateDiscount = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathName = location.pathname;
    const pathNameSplit =  pathName.split("/");
    const id = pathNameSplit[pathNameSplit.length - 1];
    const [manualInfo, setManualInfo] = useState<ManualInfo>({
        discountName: "",
        discountValue: "0",
        discountType: true,
        maximumDiscount: "0",
        minimumPrice: "0",
        expiredDate: "",
        quantity: "0"
    })
    const [productTitle, setProductTitle] = useState("");
    const [customerTitle, setCustomerTitle] = useState("");
    const [active, setActive] = useState(false);
    const [products, setProducts] = useState([])
    const [idProductSelected, setIdProductSelected] = useState<number[]>([]);
    const [productSelected, setProductSelected] = useState([]);


    const handleChangeManualInfoNameDiscount = (value: string) =>{
        setManualInfo(pre => ({...pre, discountName: value}))
    }
    const handleChangeManualInfoMinimumPrice = (value: string) =>{
        setManualInfo(pre => ({...pre, minimumPrice: value}))
    }
    const handleChangeManualInfoMaximumDiscount = (value: string) =>{
        setManualInfo(pre => ({...pre, maximumDiscount: value}))
    }
    const handleChangeManualInfoDiscountQuantity = (value: string) =>{
        setManualInfo(pre => ({...pre, quantity: value}))
    }

    const handleChangeDiscountValue = (value: string) =>{
        setManualInfo(pre => ({...pre, discountValue: value}))
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

    const getDiscount = useCallback(async() =>{
        const response = await axios.get(`http://localhost:4000/api/discount/get-discount-by-id?id=${id}`);
        if(response.data.success){
            setManualInfo((pre) => ({
                ...pre, 
                expiredDate: response.data.data.expiredDate, 
                discountType: response.data.data.type,
                discountName: response.data.data.name,
                discountValue: response.data.data.value,
                maximumDiscount: response.data.data.maximumDiscount,
                minimumPrice: response.data.data.minimumPrice,
                quantity: response.data.data.quantity
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
    

    const handleFirstButtonClick = useCallback(() => {
      if (manualInfo.discountType) return;
      setManualInfo((pre) =>({...pre,discountType: true}));
    }, [manualInfo.discountType]);
  
    const handleSecondButtonClick = useCallback(() => {
        if (!manualInfo.discountType) return;
        setManualInfo((pre) =>({...pre,discountType: false}));
      }, [manualInfo.discountType]);

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
    
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setManualInfo((pre) => ({...pre, expiredDate: e.target.value}))
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

    console.log(idProductSelected);
    

    const handleSave = async () =>{
        const saveReq =  await axios.post("http://localhost:4000/api/discount/create", {
            type: manualInfo.discountType ? 1 : 0,
            id: id,
            value: manualInfo.discountValue,
            name: manualInfo.discountName,
            productIds: idProductSelected,
            expiredDate: manualInfo.expiredDate,
            maximumDiscount: manualInfo.maximumDiscount,
            minimumPrice: manualInfo.minimumPrice,
            quantity: manualInfo.quantity,
            customerIds: [],
        })

        if(saveReq.data.success){
            alert("Thêm mới mã giảm giá thành công")
            navigate("/discount")
        }
    }


    const contextualSaveBarMarkup = (JSON.stringify(manualInfo) !== JSON.stringify({
        discountName: "",
        discountValue: "0",
        discountType: true,
        maximumDiscount: "0",
        minimumPrice: "0",
        expiredDate: "",
        quantity: "0"
    })) ? (
        <ContextualSaveBar
        saveAction={{
            onAction: handleSave,
            content: "Lưu"
        }}/>) : null
    
    useEffect(() =>{
        if(id !== "create"){
            getDiscount().then()
        }
    },[])

    return (
        <Page>
            {contextualSaveBarMarkup}

            <LegacyCard
                title="Thông tin mã giảm giá"
            >
                <LegacyCard.Section>
                    <FormLayout>
                        <TextField 
                            label="Tên mã giảm giá"
                            placeholder='Tên mã giảm giá' 
                            autoComplete='false' 
                            value={manualInfo.discountName} 
                            onChange={handleChangeManualInfoNameDiscount}
                        />
                        <TextField 
                            label="Giá tối thiểu" 
                            autoComplete='false' 
                            value={manualInfo.minimumPrice} 
                            onChange={handleChangeManualInfoMinimumPrice}
                        />
                        <TextField 
                            label="Giá giảm tối đa" 
                            autoComplete='false' 
                            value={manualInfo.maximumDiscount} 
                            onChange={handleChangeManualInfoMaximumDiscount}
                        />
                        <TextField 
                            label="Số lượng mã giảm giá" 
                            type='number'
                            autoComplete='false' 
                            value={manualInfo.quantity} 
                            onChange={handleChangeManualInfoDiscountQuantity}
                        />
                    </FormLayout>
                </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard
                title="Giá áp dụng cho mã giảm giá"
            >
                <LegacyCard.Section>
                    <FormLayout>
                        <div>Hình thức giảm giá</div>
                        <ButtonGroup segmented>
                            <Button pressed={manualInfo.discountType} onClick={handleFirstButtonClick}>
                                Giảm giá theo phần trăm
                            </Button>
                            <Button pressed={!manualInfo.discountType} onClick={handleSecondButtonClick}>
                                Giảm giá trực tiếp
                            </Button>
                        </ButtonGroup>
                        <TextField 
                            label="Giá trị" 
                            type='number' 
                            step={1}
                            autoComplete='false' 
                            value={manualInfo.discountValue} 
                            onChange={handleChangeDiscountValue}
                        />
                    </FormLayout>
                </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard title="Sản phẩm áp dụng khuyến mãi">
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
            <LegacyCard title="Thời gian kết thúc khuyến mãi">
                <LegacyCard.Section>
                    <div className='date-time'>
                        <input type='datetime-local' name="dateStart" value={manualInfo.expiredDate} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDate(e)}/>
                    </div>
                </LegacyCard.Section>
            </LegacyCard>
        </Page>
    )
}

export default CreateDiscount