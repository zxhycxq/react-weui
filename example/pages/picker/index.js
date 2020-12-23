import React from 'react';
import { Popup, Picker, CityPicker, Form, FormCell, CellBody, CellHeader, Label, Input } from '../../../build/packages';
import Page from '../../component/page';
import cnCity from './cnCity';
import city from './city';

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

    render() {
        return (
            <Page className="picker" title="Picker" subTitle="多列选择器" >
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>日期选择</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="text"
                                value={this.state.city_value}
                                onClick={ e=> {
                                    e.preventDefault();
                                    this.setState({city_show: true})
                                }}
                                placeholder="日期选择"
                                readOnly={true}
                            />
                        </CellBody>
                    </FormCell>
                </Form>

                <CityPicker
                    data={cnCity}
                    // data={city}
                    onCancel={e=>this.setState({city_show: false})}
                    onChange={text=>this.setState({city_value: text, city_show: false})}
                    show={this.state.city_show}
                    selected={ [70,1,22] }
                />
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>单选</Label>
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
                    defaultSelect={ [1] }
                />
            </Page>
        );
    }
};
export default PickerDemo;
