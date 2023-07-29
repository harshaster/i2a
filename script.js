function convertImage(){
    asciiDiv = document.getElementsByTagName('pre')[0]
    fileDiv = document.getElementById("imageinp")

    if (fileDiv.files.length == 0){
        alert('Please select an image')
        return
    }
    asciiDiv.style.fontWeight='bold';
    asciiDiv.style.lineHeight='8px'

    offX = document.getElementById('offsetx').value
    offY = document.getElementById('offsety').value
    lh = document.getElementById('lh').value

    asciiDiv.style.lineHeight=lh+'px'

    const reader = new FileReader()
    reader.readAsDataURL(fileDiv.files[0])
    
    reader.onload = function(e){
        const img = new Image();
        
        img.onload = function(){
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0,0,img.width, img.height);
            
            asciiDiv.innerText=getASCII(imageData, Number(offX), Number(offY))
            asciiDiv.parentElement.style.display="block"
        }
        img.src = e.target.result
        
    }
}

function copy_pre(){
    // write pre to clipboard
    const pre = document.getElementsByTagName('pre')[0]
    const ascii = pre.innerText
    navigator.clipboard.writeText(ascii)
}

function getASCII(imageData, ox, oy){
    
    const chars = ['@', '#', 'S',  '%', '?', '*', '+', ';', ':', ',', '.']
    let final = '';
    for (let i =0; i< imageData.height; i += oy){
        for(let j = 0; j < imageData.width; j += ox){
            const index = i * (imageData.width * 4) + j*4
            const red = imageData.data[index]
            const green = imageData.data[index+1]
            const blue = imageData.data[index+2]
            const b = (red+green+blue)/3
            const character = chars[Math.floor((b)/255 * (chars.length - 1))]
            final+=character
        }
        final += '\n'
    }
    return final
}