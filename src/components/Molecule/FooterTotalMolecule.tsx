import FooterTotal from "@components/FooterTotal";
import {PaymentMethod} from "@models/data";
import {ProductCart} from "@models/data/ProductCart";
import React from "react";
import {useTranslation} from "react-i18next";

interface FooterTotalMolecule {
    loading: boolean,
    cart: ProductCart | null,
    checked: boolean,
    card: PaymentMethod | null,
    handlePayment: () => void,
    scrollToBottom: () => void,
}

export const FooterTotalMolecule = ({
    cart,
    checked,
    card,
    loading,
    scrollToBottom,
    handlePayment
}: FooterTotalMolecule) => {
    const {t} = useTranslation();

    const payment = () => {
        handlePayment();
    };

    const scroll = () => {
        scrollToBottom();
    };

    return (
        <FooterTotal
            disabled={loading}
            checked={checked}
            cart={cart}
            loading={loading}
            buttonText={!checked ?
                !card?.last_4 ? t("subscription_screen.provide_card") : t("subscription_screen.check_before_confirming") :
                t("subscription_screen.confirm_purchase")
            }
            onPress={checked ? payment : scroll}
        />
    );
};
