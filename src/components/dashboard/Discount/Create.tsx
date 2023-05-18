import { Banner, Button, ButtonGroup, Checkbox, FormLayout, LegacyCard, Modal, Page, TextField, Thumbnail, ContextualSaveBar, Avatar } from '@shopify/polaris'
import axios from 'axios';
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {ProfileMajor} from "@shopify/polaris-icons";

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
    const [customerTitle, setCustomerTitle] = useState("");
    const [active, setActive] = useState(false);
    const [customers, setCustomers] = useState([])
    const [idCustomerSelected, setIdCustomerSelected] = useState<number[]>([]);
    const [customerSelected, setCustomerSelected] = useState([]);


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
    const fetchDiscount = useCallback(async () =>{
        if(customerTitle !== ""){
            const response = await axios.get(`http://localhost:4000/api/user/get-user-by-name?name=${customerTitle}`)
            if(response.data.success){
                setCustomers(response.data.data)
            }
        }else{
            const response = await axios.get(`http://localhost:4000/api/user/get-all-user`)
            if(response.data.success){
                setCustomers(response.data.data)
            }
        }
    },[customerTitle])

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
            if(response.data.data.users !== null){
                setCustomerSelected(response.data.data.users)
                setIdCustomerSelected(response.data.data.users.map((item: any) => item.id));
            }
        }
    },[id])

    useEffect(() => {
        fetchDiscount().then()
    }, [customerTitle])
    

    const handleFirstButtonClick = useCallback(() => {
      if (manualInfo.discountType) return;
      setManualInfo((pre) =>({...pre,discountType: true}));
    }, [manualInfo.discountType]);
  
    const handleSecondButtonClick = useCallback(() => {
        if (!manualInfo.discountType) return;
        setManualInfo((pre) =>({...pre,discountType: false}));
      }, [manualInfo.discountType]);

    const handleChangeSelectedcustomer = (checked: boolean, id: string) =>{
        let ids = Number(id);
        
        if(idCustomerSelected.indexOf(ids) !== -1) {
            const selected = idCustomerSelected.filter((customer) => customer !== ids)
            setIdCustomerSelected(selected);
            setCustomerSelected((pre) => pre.filter((item: any) => item.id !== ids) );
        }else{
            setIdCustomerSelected((pre) => ([...pre, ids]))    
            const selected = customers.filter((item: any) => item.id === ids)
            setCustomerSelected((pre) => [...pre, selected[0]])        
        }
    }

    const handleDismisCustomerSelected = (id: any) =>{
        const ids = Number(id);
        const selected = idCustomerSelected.filter((customer) => customer !== ids)
        setIdCustomerSelected(selected);
        setCustomerSelected((pre) => pre.filter((item: any) => item.id !== ids) );
    }
    
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setManualInfo((pre) => ({...pre, expiredDate: e.target.value}))
    }

    const customerMarkup = customers && customers.map((customer:{id: number, firstName: string, lastName: string, phoneNumber: string}) =>{
        return <div key={customer.id} className='customer-search-list'>
            <Checkbox 
                key={customer.id}
                id={customer.id+ ""}
                label={<Avatar customer />} 
                checked={idCustomerSelected.includes(customer.id)} 
                onChange={handleChangeSelectedcustomer}
            />
            {customer.firstName + " " + customer.lastName}
            {customer.phoneNumber}
        </div>;
    })

    console.log(idCustomerSelected);
    

    const handleSave = async () =>{
        const saveReq =  await axios.post("http://localhost:4000/api/discount/create", {
            type: manualInfo.discountType ? 1 : 0,
            id: id,
            value: manualInfo.discountValue,
            name: manualInfo.discountName,
            customerIds: idCustomerSelected,
            expiredDate: manualInfo.expiredDate,
            maximumDiscount: manualInfo.maximumDiscount,
            minimumPrice: manualInfo.minimumPrice,
            quantity: manualInfo.quantity,
            productIds: [],
        })

        if(saveReq.data.success){
            if(id === "create"){
                alert("Thêm mới mã giảm giá thành công")
            }else{
                alert("Cập nhật mã giảm giá thành công")
            }
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
                            placeholder='Tên khách hàng'
                            autoComplete='false'
                            value={customerTitle}
                            onFocus={handleChange}
                            onChange={(value) =>setCustomerTitle(value)}
                        />
                    </FormLayout>
                    {
                        customerSelected.length > 0 ? customerSelected.map((customer: any) => ( 
                        <div style={{paddingTop: '12px'}} key={customer.id}>
                        <Banner key={customer.id} onDismiss={() => handleDismisCustomerSelected(customer.id)} hideIcon>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Avatar customer size='medium'/>
                                <span style={{ marginLeft: "12px" }}>{customer.firstName + " " + customer.lastName} - {customer.phoneNumber}</span>
                            </div>
                        </Banner>
                    </div>
                            )) : null
                    }
                    <Modal
                        open={active}
                        onClose={handleChange}
                        title="Danh sách khách hàng"
                        primaryAction={{
                            content: 'Thêm',
                            onAction: handleChange,
                        }}
                    >
                        <Modal.Section>
                        <TextField placeholder='Tên khách hàng' autoComplete='false' autoFocus value={customerTitle} onChange={(value) => setCustomerTitle(value)}/>
                        {customerMarkup}
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