import {CBImg, FONTS, WarningImg} from "@assets/index";
import React from "react";
import {useTranslation} from "react-i18next";
import {Image, Text, View, ViewProps} from "react-native";

type PaymentInfosProps = ViewProps;

const PaymentInfos: React.FC<PaymentInfosProps> = (): React.ReactElement | null => {

    const {t} = useTranslation();

    return (
        <View
            style={{
                marginHorizontal: 10,
                paddingTop: 70,
                paddingBottom: 20,
            }}>
            <View
                style={{
                    paddingBottom: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{width: 60, height: 70}}
                    source={WarningImg}
                />
                <Text style={{width: 40}}/>
                <Image
                    style={{width: 70, height: 70}}
                    source={CBImg}
                />
            </View>
            <Text
                style={{
                    textAlign: "center",
                    fontSize: 20,
                    paddingBottom: 10,
                    fontWeight: "bold",
                }}>
                {t("payment.deposit.temporary")}
            </Text>
            <Text
                style={{
                    textAlign: "center",
                    fontSize: FONTS.sizeText,
                    lineHeight: 29,
                }}>
                {t("payment.deposit.title")}
                {t("payment.deposit.text")}
            </Text>

            <Text style={{
                textAlign: "center",
                fontSize: FONTS.sizeText,
                lineHeight: 29,
            }}>
                <Text>
                    {t("payment.deposit.text2")}
                </Text>
                <Text style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                }}>
                    {t("payment.deposit.text3")}</Text>
                <Text>
                    {t("payment.deposit.text4")}
                </Text>
                <Text
                    style={{
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                    }}>
                    {t("payment.deposit.text5")}
                </Text>
                <Text>
                    {t("payment.deposit.text4")}
                </Text>
                <Text
                    style={{
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                    }}>
                    {t("payment.deposit.text6")}
                </Text>
                <Text>
                    {t("payment.deposit.text7")}
                </Text>
                <Text
                    style={{
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                    }}>
                    {t("payment.deposit.text8")}
                </Text>
                <Text>
                    {t("payment.deposit.text9")}
                </Text>
            </Text>

        </View>
    );
};


export default PaymentInfos;



