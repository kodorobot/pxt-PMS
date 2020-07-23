//% weight=0 color=#0a8c92 block="PMS"
namespace PMS {
    let init = false
    var pm1_air = 0
    var pm25_air = 0
    var pm10_air = 0
    var pm03_count = 0
    var pm05_count = 0
    var pm10_count = 0
    var pm25_count = 0
    var temperature = 0
    var humidity = 0

    export enum Options {
        //% blockId="pm1_air" block="pm1.0 concentration"
        pm1a = 0,
        //% blockId="pm25_air" block="pm2.5 concentration"
        pm25a = 1,
        //% blockId="pm10_air" block="pm10 concentration"
        pm10a = 2,
        //% blockId="pm03_count" block="pm0.3 amount"
        pm03c = 3,
        //% blockId="pm05_count" block="pm0.5 amount"
        pm05c = 4,
        //% blockId="pm10_count" block="pm1.0 amount"
        pm10c = 5,
        //% blockId="pm25_count" block="pm2.5 amount"
        pm25c = 6,
        //% blockId="temperature" block="temperature"
        temperature = 7,
        //% blockId="humidity" block="humidity"
        humidity = 8,
    }


    //% blockId="setSerial" block="set PMS to %pin"
    //% weight=100 blockGap=20 blockInlineInputs=true
    export function setSerial(pin: SerialPin): void {
        basic.pause(300)
        serial.redirect(
            SerialPin.USB_TX,
            pin,
            BaudRate.BaudRate9600
        )
        init = true
    }

    //% blockId="getData" block="update data"
    //% weight=90 blockGap=20 blockInlineInputs=true   
    export function getData(): void {
    	let myData = 0
        if (init) {
            let temp = 0
            let data_length = 0
            let raw_data: number[] = []
            while(raw_data.length < 32){
            	temp = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
	            raw_data.push(temp)
	            if (raw_data.length == 1 && raw_data[0] != 66) raw_data = []
	            else if (raw_data.length == 2 && raw_data[1] != 77) raw_data = []
	            else if (raw_data.length > 3) data_length = raw_data[2] * 256 + raw_data[3]
	            if (raw_data.length == 32 && data_length == 28){
	            	let checksum = 0
	            	for(let i = 0;i < 30;i++) checksum += raw_data[i]
	            	if (checksum == raw_data[31] * 256 + raw_data[32]){
                        pm1_air = raw_data[10] * 256 + raw_data[11]
                        pm25_air = raw_data[12] * 256 + raw_data[13]
                        pm10_air = raw_data[14] * 256 + raw_data[15]
                        pm03_count = raw_data[16] * 256 + raw_data[17]
                        pm05_count = raw_data[18] * 256 + raw_data[19]
                        pm10_count = raw_data[20] * 256 + raw_data[21]
                        pm25_count = raw_data[22] * 256 + raw_data[23]
                        temperature = raw_data[24] * 256 + raw_data[25]
                        humidity = raw_data[26] * 256 + raw_data[27]
	            	} else raw_data = []
	            }
            }
        }
    }

    //% blockId="getData" block="update data"
    //% weight=90 blockGap=20 blockInlineInputs=true   
    export function printData(option: Options): number {
        switch (option) {
            case 0: {
                return pm1_air
                break
            }
            case 1: {
                return pm25_air
                break
            }
            case 2: {
                return pm10_air
                break
            }
            case 3: {
                return pm03_count
                break
            }
            case 4: {
                return pm05_count
                break
            }
            case 5: {
                return pm10_count
                break
            }
            case 6: {
                return pm25_count
                break
            }
            case 7: {
                return temperature
                break
            }
            case 8: {
                return humidity
                break
            }
            default: {
                return 0
                break
            }
        }
    }
}