import { createWorker } from "tesseract.js"

const worker = await createWorker("eng", 1, {
    logger: m => console.log(m)
});

(async () => {
    const { data: { text } } = await worker.recognize("C:\\Users\\Swayam Bhoir\\Desktop\\Mini Project\\answer sheet checker\\backend\\model\\demo_images\\img5.jpeg")
    console.log(text)
    await worker.terminate()
})()

