import Header from "@components/tutorial/Header";
import SideBar from "@components/tutorial/SideBar";
import SelectedTutorial from "@components/tutorial/SelectedTutorial";

export default function Tutorial() {
    return (
        <div className="flex flex-col">
            <Header />
            <div className="h-max flex">
                <SideBar />
                <SelectedTutorial />
            </div>
        </div>
    )
}