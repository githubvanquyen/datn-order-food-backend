import { Banner, Button, ButtonGroup, Checkbox, FormLayout, LegacyCard, Modal, Page, TextField, Thumbnail, ContextualSaveBar } from '@shopify/polaris'
import axios from 'axios';
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Create = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathName = location.pathname;
    const pathNameSplit =  pathName.split("/");
    const id = pathNameSplit[pathNameSplit.length - 1];
    const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
    const [discountValue, setDiscountValue] = useState("0");
    const [productTitle, setProductTitle] = useState("");
    const [active, setActive] = useState(false);
    const [products, setProducts] = useState([])
    const [idProductSelected, setIdProductSelected] = useState<number[]>([]);
    const [productSelected, setProductSelected] = useState([]);
    const [date, setDate] = useState({
        dateStart: "",
        dateEnd:""
    })

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

    const getFls = useCallback(async() =>{
        const response = await axios.get(`http://localhost:4000/api/flashsale/get-fls-by-id?id=${id}`);
        if(response.data.success){
            setIdProductSelected(response.data.data.products.map((item: any) => item.id));
            setProductSelected(response.data.data.products)
            setDate({
                dateEnd: response.data.data.dateEnd,
                dateStart: response.data.data.dateStart
            })
            setIsFirstButtonActive(response.data.data.discountType === 1);
            setDiscountValue(response.data.data.discountValue)
        }
    },[id])

    useEffect(() => {
        fetchProduct().then()
    }, [productTitle])
    

    const handleFirstButtonClick = useCallback(() => {
      if (isFirstButtonActive) return;
      setIsFirstButtonActive(true);
    }, [isFirstButtonActive]);
  
    const handleSecondButtonClick = useCallback(() => {
      if (!isFirstButtonActive) return;
      setIsFirstButtonActive(false);
    }, [isFirstButtonActive]);

    const handleChangeDiscountValue = useCallback((value: string) =>{
        setDiscountValue(value)
    },[])

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
        setDate((pre) => ({...pre, [e.target.name]: e.target.value}))
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
        const saveReq =  await axios.post("http://localhost:4000/api/flashsale/create", {
            discountType: isFirstButtonActive ? 1 : 0,
            id: id,
            discountValue: discountValue,
            productIds: idProductSelected,
            dateStart: date.dateStart,
            dateEnd: date.dateEnd
        })

        if(saveReq.data.success){
            alert("Thêm mới khuyến mãi thành công")
            navigate("/flashsale")
        }
    }


    const contextualSaveBarMarkup = (isFirstButtonActive !== true || discountValue !== "0" || idProductSelected.length > 0 || JSON.stringify(date) !== JSON.stringify({ dateStart: "", dateEnd: ""})) ? (
        <ContextualSaveBar
        saveAction={{
            onAction: handleSave,
            content: "Lưu"
        }}/>) : null
    
    useEffect(() =>{
        if(id !== "create"){
            getFls().then()
        }
    },[])

    return (
        <Page>
            {contextualSaveBarMarkup}
            <LegacyCard
                title="Giá giảm khuyến mãi"
            >
                <LegacyCard.Section>
                    <FormLayout>
                        <div>Hình thức giảm giá sản phẩm khuyến mãi</div>
                        <ButtonGroup segmented>
                            <Button pressed={isFirstButtonActive} onClick={handleFirstButtonClick}>
                                Giảm giá phần trăm
                            </Button>
                            <Button pressed={!isFirstButtonActive} onClick={handleSecondButtonClick}>
                                Giảm giá trực tiếp
                            </Button>
                        </ButtonGroup>
                        <TextField 
                            label="Giá trị" 
                            type='number' 
                            step={1}
                            autoComplete='false' 
                            value={discountValue} 
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
            <LegacyCard title="Khung giờ khuyến mãi">
                <LegacyCard.Section>
                    <div className='date-time'>
                        <div className='date-start'>
                            Giờ bắt đầu
                            <input type='datetime-local' name="dateStart" value={date.dateStart} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDate(e)}/>
                        </div>
                        <div className='date-end'>
                            Giờ kết thúc
                            <input type='datetime-local' name="dateEnd" value={date.dateEnd} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDate(e)}/>  
                        </div>
                    </div>
                </LegacyCard.Section>
            </LegacyCard>
        </Page>
    )
}

export default Create