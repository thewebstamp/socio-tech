function Empty({img, p}) {
    return (
        <div className="flex flex-col gap-10 items-center px-8 text-center josefin translate-y-[-50px] [@media(max-width:1000px)]:translate-y-[-130px] [@media(max-width:685px)]:translate-y-[-65px]">
            <img className="animate-vfloat w-[75%] max-w-[280px]" src={img} alt="" />
            <p className="text-[18.5px] text-gray-600 dark:text-gray-400">{p}</p>
        </div>
    );
}

export default Empty;