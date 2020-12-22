import React from 'react';
import { Popup, Picker, CityPicker, Form, FormCell, CellBody, CellHeader, Label, Input } from '../../../build/packages';
import Page from '../../component/page';
import cnCity from './cnCity';

class PickerDemo extends React.Component {

    state = {
        picker_show: false,
        picker_value: '',
        
        picker_group: [
            {
                items: [
                    {
                        label: '男',
                        gender: 1
                    },
                    {
                        label: '女',
                        gender: 0
                    }
                ]
            }
        ],
        city_show: false,
        city_value: ''
    };

    hide(){
        this.setState({
            picker_show: false,
            city_show: false
        })
    }
    
    changeData(text,a,b){
        console.log('%c--text-- ', 'color:blue;', text,a,b);
        this.setState({
            city_value: text, city_show: false
        })
    }

    render() {
        return (
            <Page className="picker" title="Picker" subTitle="多列选择器" >
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>City</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="text"
                                value={this.state.city_value}
                                onClick={ e=> {
                                    e.preventDefault();
                                    this.setState({city_show: true})
                                }}
                                placeholder="Chose Your City"
                                readOnly={true}
                            />
                        </CellBody>
                    </FormCell>
                </Form>

                <CityPicker
                    data={cnCity}
                    onCancel={e=>this.setState({city_show: false})}
                    onChange={(text,a,b)=>this.changeData(text,a,b)}
                    show={this.state.city_show}
                />
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>Direct Picker</Label>
                        </CellHeader>
                        <CellBody>
                            <Input
                                type="text"
                                onClick={e=>{
                                    e.preventDefault()
                                    this.setState({picker_show: true})
                                }}
                                placeholder="Pick a item"
                                value={this.state.picker_value}
                                readOnly={true}
                            />
                        </CellBody>
                    </FormCell>
                </Form>

                <Picker
                    onChange={selected=>{
                        let value = ''
                        selected.forEach( (s, i)=> {
                            console.log('%c--s-- ', 'color:blue;',selected, s);
                            value = this.state.picker_group[i]['items'][s].label
                        })
                        this.setState({
                            picker_value: value,
                            picker_show: false
                        })
                    }}
                    groups={this.state.picker_group}
                    show={this.state.picker_show}
                    onCancel={e=>this.setState({picker_show: false})}
                />
            </Page>
        );
    }
};
export default PickerDemo;
