import { Languages } from '@common';
import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Public/Contact/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, List, ListItem, Text, View } from 'native-base';
import React from 'react';
import { Image, ImageBackground, StatusBar } from 'react-native';

export default class extends React.Component {
    render() {
        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('PublicHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Contact.contactUs.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <ImageBackground source={require('@Asset/images/bg_in.png')} imageStyle={'cover'} style={Styles.page}>
                    <View style={Styles.pageCol}>
                        <Image source={require('@Asset/images/contact.png')} style={Styles.pageIcon} />
                    </View>

                    <View style={Styles.infoBg}>
                        <List style={Styles.infoTab}>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="map-marker-radius" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Contact.address.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>Lome, Togo</Text>
                                </View>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="phone" type="FontAwesome" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Contact.phone.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>+228 91122063 / +228 22701112</Text>
                                </View>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="mail" type="Entypo" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Contact.email.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>support@vitoma.com</Text>
                                </View>
                            </ListItem>
                            <ListItem style={[Styles.infoItem, Styles.infoItemLast]}>
                                <Icon name="web" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Contact.webSite.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>vitoma.com</Text>
                                </View>
                            </ListItem>
                        </List>
                    </View>
                </ImageBackground>
            </Content>

            <FooterNav />

        </Container>
    }
}
