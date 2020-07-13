import bindAll from 'lodash.bindall';
import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    Colors
} from 'react-native';
import sdk from './sdk.js';
export default class VoiceView extends Component {

    constructor(props) {
        super(props)
        // bindAll(this, [
        //     'onStart'
        // ]);
        this.state = { result: '暂无结果' }
    }
    componentWillMount() {
        sdk.init();
    }
    render() {

        return <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={{ height: 30 }} />
            <Button
                containerStyle={styles.containerStyle}
                style={{ color: 'white' }}
                onPress={() => {
                    sdk.startRecognizer(res => {
                        this.setState({ result: res })
                    });
                }}
                onResponderTerminationRequest={() => true}
                title='点击按钮开始识别'
            />
            <View style={{ height: 30 }} />
            <Button
                containerStyle={styles.containerStyle}
                style={{ color: 'white' }}
                onPress={() => {
                    sdk.stopRecognizer();
                }}
                title='停止识别'
            />
            <View style={{ height: 30 }} />
            <Text>{this.state.result}</Text>

        </ScrollView>
    }


}

const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: Colors.lighter,
        backgroundColor: '#F8F8FF',
    },
    containerStyle: {
        backgroundColor: '#0275d8',
        margin: 4,
        padding: 4,
        borderRadius: 2,
    },
});

