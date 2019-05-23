import { shallow, mount } from "enzyme";
import React from "react";
import Feedback from "../components/Feedback";


describe("The ChatRoom component", () => {
    let dummyFn = jest.fn();
    let context = {
        parentParams: {
            userId: '',
            userFirstName: '',
            uniqueId: '',
        },
        sessionid: '',
        recommendationType: ''
    }
it('should change rating', () => {  
    const wrapper = shallow(<Feedback cancelBtnClicked={dummyFn}/>);
    const instance = wrapper.instance();
    spyOn(instance, 'ratingChanged').and.callThrough();
    wrapper.find('.rating-div').simulate('change', 4);
    expect(instance.ratingChanged).toHaveBeenCalled();
});
it('should call submit click function', () => {  
    const wrapper = mount(<Feedback cancelBtnClicked={dummyFn} context={context}/>);
    const instance = wrapper.instance();
    instance.ratingValue = 4;
    let rating = instance.submitClicked();
    expect(rating).toEqual(4);
});
it('should call submit feedback data function', () => {  
    const wrapper = mount(<Feedback cancelBtnClicked={dummyFn} context={context}/>);
    const instance = wrapper.instance();
    spyOn(instance, 'submitFeedBackData').and.callThrough();
    instance.ratingValue = 4;
    instance.submitClicked();
    expect(instance.submitFeedBackData).toHaveBeenCalled();
});
});