import styled from 'styled-components';

const FormContent = styled.div`
    display: flex;  
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 90%;
    margin-left: 5%;
    margin-top: 20px;
`;

const FormInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FormImage = styled.img `
    width: 96px;    
    height: 96px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 100px;
`;

const FormText = styled.p `
    color: rgba(46, 48, 87, 0.6);
`;

const NoForm = styled.div `
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 5%;
    margin-top: 5%;
    align-items: center;
    justify-content: center;
`;

interface FormProps {
    forms:{ name : string; url : string }[];
    formsImage: Record<string, string>;
}

export function Form({ forms, formsImage }:FormProps) {

    return (
        <FormContent>
            {forms.length > 1 ? (
            <>
            {forms.map((array : { name : string; url : string }) => (
                <FormInfo key={array.url}>
                    <FormImage src={formsImage[array.name]} alt={array.name} />
                    <FormText>{array.name.charAt(0).toUpperCase() + array.name.replace(/-/g, ' ').slice(1)}</FormText>
                </FormInfo>
            ))}
            </>
            ) : (
                <NoForm>
                    This Pokemon doesn't have any other forms...
                </NoForm>
            )}
        </FormContent>
    );
};