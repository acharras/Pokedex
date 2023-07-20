import styled from 'styled-components';

const HeldItemContainer = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
    align-items: center;
    justify-content: center;
`;

const HeldItemContent = styled.div `
    display : flex;
    flex-direction: row;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 20px;
`;

const HeldItemInfo = styled.li `
    display : flex;
    flex-direction: column;
    margin: 5%;
`;

interface HeldItemProps {
    heldItems: { item: { name: string } }[];
}

export function HeldItem({ heldItems }:HeldItemProps) {

    return (
        <HeldItemContainer>
            {heldItems.length > 0 ? (
            <>
            {heldItems.map((array: { item: { name: string } }) => (
                <HeldItemContent key={array.item.name}>
                    <HeldItemInfo>
                        {array.item.name.charAt(0).toUpperCase() + array.item.name.replace(/-/g, ' ').slice(1)}
                    </HeldItemInfo>
                </HeldItemContent>
            ))}
            </>
            ) : (
                <>
                    This Pokemon doesn't hold any items...
                </>
            )}
        </HeldItemContainer>
    );
};
