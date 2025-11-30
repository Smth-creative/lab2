package pupupu.beans;

import pupupu.classes.Result;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;

public class ResultStorageBean implements Serializable {
    private List<Result> results = new CopyOnWriteArrayList<>();

    public void addResult(Result result) {
        results.add(0, result);
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public void deleteResult(int index) {
        results.remove(index);
    }

    @Override
    public String toString() {
        return "ResultStorageBean{" +
                "results=" + results +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ResultStorageBean that = (ResultStorageBean) o;
        return Objects.equals(results, that.results);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(results);
    }
}
